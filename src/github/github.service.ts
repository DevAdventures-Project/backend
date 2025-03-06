import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {
    private readonly token: string;
    private readonly org: string;
    private readonly baseUrl: string = 'https://api.github.com';

    constructor() {
        // Récupère le token et le nom d'organisation depuis les variables d'environnement
        this.token = process.env.GITHUB_TOKEN || '';
        this.org = process.env.GITHUB_ORG || '';

        if (!this.token) {
            throw new Error('GITHUB_TOKEN is not set');
        }
        if (!this.org) {
            throw new Error('GITHUB_ORG is not set');
        }
    }

    // Récupère la liste des dépôts de l'organisation
    async getRepos() {
        try {
            const response = await axios.get(`${this.baseUrl}/orgs/${this.org}/repos`, {
                headers: {
                    Authorization: `token ${this.token}`,
                    Accept: 'application/vnd.github+json',
                },
            });
            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data || 'Error fetching repositories',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Récupère les issues pour un dépôt spécifique
    async getIssuesForRepo(repoName: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/repos/${this.org}/${repoName}/issues`, {
                headers: {
                    Authorization: `token ${this.token}`,
                    Accept: 'application/vnd.github+json',
                },
            });
            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data || 'Error fetching issues',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
