import axios from 'axios';
import { API_URL } from '../config.js';

class StoryService {
    async getStories(params = {}) {
        try {
            const response = await axios.get(`${API_URL}/stories/`, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to fetch stories' };
        }
    }

    async getStoryBySlug(slug) {
        try {
            const response = await axios.get(`${API_URL}/stories/${slug}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to fetch story' };
        }
    }

    async createStory(storyData) {
        try {
            const formData = new FormData();
            Object.keys(storyData).forEach(key => {
                if (key === 'cover_image' && storyData[key]) {
                    formData.append(key, storyData[key]);
                } else if (storyData[key] !== null && storyData[key] !== undefined) {
                    formData.append(key, storyData[key]);
                }
            });
            
            const response = await axios.post(`${API_URL}/stories/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to create story' };
        }
    }

    async updateStory(slug, storyData) {
        try {
            const formData = new FormData();
            Object.keys(storyData).forEach(key => {
                if (key === 'cover_image' && storyData[key]) {
                    formData.append(key, storyData[key]);
                } else if (storyData[key] !== null && storyData[key] !== undefined) {
                    formData.append(key, storyData[key]);
                }
            });
            
            const response = await axios.patch(
                `${API_URL}/stories/${slug}/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to update story' };
        }
    }

    async deleteStory(slug) {
        try {
            await axios.delete(`${API_URL}/stories/${slug}/`);
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to delete story' };
        }
    }

    async likeStory(slug) {
        try {
            const response = await axios.post(`${API_URL}/stories/${slug}/like/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to like story' };
        }
    }

    async shareStory(slug, platform) {
        try {
            const response = await axios.post(`${API_URL}/stories/${slug}/share/`, {
                platform
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to share story' };
        }
    }

    async getUserStories(username) {
        try {
            const response = await axios.get(`${API_URL}/stories/`, {
                params: { author: username }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to fetch user stories' };
        }
    }

    // Chapter methods
    async getChapters(storySlug) {
        try {
            const response = await axios.get(`${API_URL}/stories/${storySlug}/chapters/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to fetch chapters' };
        }
    }

    async createChapter(storySlug, chapterData) {
        try {
            const response = await axios.post(`${API_URL}/stories/${storySlug}/chapters/`, chapterData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to create chapter' };
        }
    }

    // Decision point methods
    async getDecisionPoints(storySlug, chapterId) {
        try {
            const response = await axios.get(
                `${API_URL}/stories/${storySlug}/chapters/${chapterId}/decision-points/`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to fetch decision points' };
        }
    }

    async createDecisionPoint(storySlug, chapterId, decisionData) {
        try {
            const response = await axios.post(
                `${API_URL}/stories/${storySlug}/chapters/${chapterId}/decision-points/`,
                decisionData
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to create decision point' };
        }
    }

    async vote(storySlug, chapterId, decisionPointId, choiceId) {
        try {
            const response = await axios.post(
                `${API_URL}/stories/${storySlug}/chapters/${chapterId}/decision-points/${decisionPointId}/vote/`,
                { choice: choiceId }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to submit vote' };
        }
    }
}

const storyService = new StoryService();
export { storyService };
