import type { GitHubUserProfile } from "../types/GitHubUserProfile.js";
import type { GitHubUserRepo } from "../types/GitHubUserRepo.js";
import timers from "timers/promises";

const FetchGitHub = async (Username: string): Promise<GitHubUserProfile> => await fetch(`https://api.github.com/users/${Username}`).then(Res => Res.json());

const FetchRepositories = async (Token: string): Promise<GitHubUserRepo[]> => {
    const Output: GitHubUserRepo[] = [];
    for(let i: number = 1; ; i++) {
        console.log(`Processing page: ${i}.`);
        const Response: Response = await fetch(`https://api.github.com/user/repos?per_page=100&page=${i}`, {
            headers: { Authorization: `Bearer ${Token}` }
        });
        const Repo: GitHubUserRepo[] = await Response.json();
        Output.push(...Repo);

        if(Repo.length < 100) 
            break;
        await timers.setTimeout(250);
    }
    return Output;
};

const FetchLanguageAPI = async (Username: string, Repo: string, Token: string): Promise<Record<string, number>> => await fetch(
    `https://api.github.com/repos/${Username}/${Repo}/languages`,
    {
        headers: { Authorization: `Bearer ${Token}` }
    }
).then(Res => Res.json());

const GetRepoStats = async (Username: string, Repo: string, Token: string): Promise<{ Issues: number; PRs: number; }> => {
    const Output: { Issues: number; PRs: number; } = {
        Issues: 0,
        PRs: 0
    };
    for(let i: number = 1; ; i++) {
        console.log(`Processing stats: ${Repo}, Page ${i}.`);
        const Response: Response = await fetch(`https://api.github.com/repos/${Username}/${Repo}/issues?state=open&per_page=100&page=${i}`, {
            headers: { Authorization: `Bearer ${Token}` }
        });

        if(Response.status === 403) {
            console.log(`This token doesn't have access to ${Repo}, skipping.`);
            break;
        }

        const JSONed: any[] = await Response.json();
        const Total: number = JSONed.length;
        const PRs: number = JSONed.filter(Item => !!Item.pull_request).length;
        const Issues: number = Total - PRs;

        Output.Issues += Issues;
        Output.PRs += PRs;

        if(JSONed.length < 100) 
            break;
        
        await timers.setTimeout(250);
    }
    return Output;
};

const GetCommitCount = async (Username: string, Repo: string, Token: string): Promise<number> => {
    let Output: number = 0;
    for(let i: number = 1; ; i++) {
        console.log(`Processing commits: ${Repo}, Page ${i}.`);
        const Response: Response = await fetch(`https://api.github.com/repos/${Username}/${Repo}/commits?per_page=100&page=${i}`, {
            headers: { Authorization: `Bearer ${Token}` }
        });

        if(Response.status === 403) {
            console.log(`This token doesn't have access to ${Repo}, skipping.`);
            break;
        }

        const JSONed: any[] = await Response.json();
        Output += JSONed.length;
        
        if(JSONed.length < 100) 
            break;
        
        await timers.setTimeout(250);
    }
    return Output;
};

export default {
    FetchGitHub,
    FetchRepositories,
    GetCommitCount,
    FetchLanguageAPI,
    GetRepoStats
};