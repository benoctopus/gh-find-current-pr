import * as core from '@actions/core';
import * as github from '@actions/github';

async function main() {
    const token = core.getInput('github-token', { required: false }) || process.env.GITHUB_TOKEN;
    const state = (core.getInput('state', { required: false }) || 'open').toLowerCase();
    const sha = core.getInput('sha', { required: true });

    if (!token) {
        throw new Error('No GITHUB_TOKEN found');
    }

    const octokit = github.getOctokit(token);
    const context = github.context;
    const result = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha,
    });

    console.warn(result);

    const prs = result.data.filter((el) => el.state === state);
    const pr = prs.find((el) => {
        return context.payload.ref === `refs/heads/${el.head.ref}`;
    });

    console.warn(pr);

    if (!pr) {
        throw new Error('No PR found');
    }

    core.info(`Setting output: head: ${pr?.head?.ref || ''}`);
    core.setOutput('head', pr?.head?.ref || '');

    core.info(`Setting output: base: ${pr?.base?.ref || ''}`);
    core.setOutput('base', pr?.base?.ref || '');

    core.info(`Setting output: headSha: ${pr?.head?.sha || ''}`);
    core.setOutput('head-sha', pr?.head?.sha || '');

    core.info(`Setting output: headSha: ${pr?.head?.sha || ''}`);
    core.setOutput('head-sha', pr?.head?.sha || '');

    core.info(`Setting output: draft: ${(pr && pr.draft) || ''}`);
    core.setOutput('draft', (pr && pr.draft) || '');

    core.info(`Setting output: pr: ${(pr && pr.number) || ''}`);
    core.setOutput('pr', (pr && pr.number) || '');

    core.info(`Setting output: number: ${(pr && pr.number) || ''}`);
    core.setOutput('number', (pr && pr.number) || '');

    core.info(`Setting output: title: ${(pr && pr.title) || ''}`);

    core.setOutput('title', (pr && pr.title) || '');
}

main().catch((err) => core.setFailed(err.message));
