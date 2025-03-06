import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import {ApiTags} from "@nestjs/swagger";

@ApiTags("github")
@Controller('github')
export class GithubController {
    constructor(private readonly githubService: GithubService) {}

    // GET /github/repos -> renvoie tous les dépôts de l'organisation
    @Get('repos')
    async getRepos() {
        return await this.githubService.getRepos();
    }

    // GET /github/issues/:repo -> renvoie toutes les issues du dépôt spécifié
    @Get('issues/:repo')
    async getIssues(@Param('repo') repo: string) {
        return await this.githubService.getIssuesForRepo(repo);
    }
}