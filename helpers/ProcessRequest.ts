import LoadEnv from "../LoadEnv.js";
import type { GitHubUserRepo } from "../types/GitHubUserRepo.js";
import FetchGitHub from "./FetchGitHub.js";

export interface Processed {
    TotalStars: number;
    TotalCommits: number;
    TotalPRs: number;
    TotalIssues: number;
    TopLanguage: string;
}

const ProcessRequest = async (): Promise<Processed> => {
    const Output: Processed = {
        TotalStars: 0,
        TotalCommits: 0,
        TotalPRs: 0,
        TotalIssues: 0,
        TopLanguage: ""
    };
    const LanguageCount: Record<string, number> = {};
    const Repos: GitHubUserRepo[] = await FetchGitHub.FetchRepositories(LoadEnv.GITHUB_TOKEN);
    for(const Repo of Repos) {
        if(Repo.fork)
            continue;
        
        if(Repo.language) {
            const Languages: Record<string, number> = await FetchGitHub.FetchLanguageAPI(Repo.owner.login, Repo.name, LoadEnv.GITHUB_TOKEN);
            for(const Language in Languages) {
                LanguageCount[Language] ??= 0;
                LanguageCount[Language] += Languages[Language];
            }
        }
        const RepoStat = await FetchGitHub.GetRepoStats(Repo.owner.login, Repo.name, LoadEnv.GITHUB_TOKEN);

        Output.TotalStars += Repo.stargazers_count;
        Output.TotalIssues += RepoStat.Issues;
        Output.TotalPRs += RepoStat.PRs;
        Output.TotalCommits += await FetchGitHub.GetCommitCount(Repo.owner.login, Repo.name, LoadEnv.GITHUB_TOKEN);
    }
    Output.TopLanguage = Object.keys(LanguageCount).reduce((a, b) => LanguageCount[a] > LanguageCount[b] ? a : b);
    return Output;
};

export default ProcessRequest;