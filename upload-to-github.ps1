<#
upload-to-github.ps1
Creates a GitHub repository (via API) and pushes the current project to it.
Usage: run this in PowerShell from the project root.
You will be prompted for your GitHub username, repo name, and a Personal Access Token (PAT).
#>
param(
    [string]$UserName,
    [string]$RepoName,
    [switch]$Private
)

function Read-PatSecure {
    $secure = Read-Host "Enter GitHub Personal Access Token (input hidden)" -AsSecureString
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git is not installed or not on PATH. Install Git and retry."
    exit 1
}

if (-not $UserName) { $UserName = Read-Host "GitHub username (owner)" }
if (-not $RepoName) { $RepoName = Read-Host "Repository name (will be created)" }

$pat = Read-PatSecure
if (-not $pat) {
    Write-Error "No PAT provided. Exiting."
    exit 1
}

# Create repo via GitHub API
$body = @{ name = $RepoName; private = $Private.IsPresent } | ConvertTo-Json
$headers = @{ Authorization = "token $pat"; 'User-Agent' = 'upload-to-github-script' }

try {
    $resp = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Repository created: $($resp.html_url)"
} catch {
    # If repo exists, GitHub returns 422 — try to continue if that's the case
    if ($_.Exception.Response -and ($_.Exception.Response.StatusCode.Value__ -eq 422)) {
        Write-Warning "Repository may already exist. Proceeding to add remote and push."
    } else {
        Write-Error "Failed to create repo: $_"
        exit 1
    }
}

# Ensure git repo and commit
if (-not (Test-Path .git)) {
    git init
    git add .
    git commit -m "chore: initial commit — prepare project for GitHub + Vercel"
} else {
    # create commit if no commits
    $hasCommits = git rev-parse --verify HEAD 2>$null
    if (-not $?) {
        git add .
        git commit -m "chore: initial commit — prepare project for GitHub + Vercel"
    }
}

# Set main branch and remote with embedded PAT for pushing
git branch -M main
# Use $() to safely expand the PAT variable inside the URL
$remoteUrl = "https://$UserName:$($pat)@github.com/$UserName/$RepoName.git"
# Remove existing origin if present
try { git remote remove origin } catch {}

git remote add origin $remoteUrl

Write-Host "Pushing to https://github.com/$UserName/$RepoName (this will use the PAT you entered)..."
# Push
$push = git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Error "git push failed. See output above for details."
    exit $LASTEXITCODE
}

Write-Host "Push successful. Repository URL: https://github.com/$UserName/$RepoName"

# Clear PAT variable
Remove-Variable pat -ErrorAction SilentlyContinue

exit 0
