import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GithubService } from "./github.service";

@ApiTags("github")
@Controller("github")
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  // GET /github/repos -> renvoie tous les dépôts de l'organisation
  @Get("repos")
  async getRepos() {
    return await this.githubService.getRepos();
  }

  // GET /github/issues/:repo -> renvoie toutes les issues du dépôt spécifié
  @Get("issues/:repo")
  async getIssues(@Param("repo") repo: string) {
    return await this.githubService.getIssuesForRepo(repo);
  }
}
