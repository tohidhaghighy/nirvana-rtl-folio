// const API_BASE_URL = "https://viraap.co/api";
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "API request failed");
    }
    return response.json();
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    return this.handleResponse(response);
  }

  // Auth methods
  async signUp(email: string, password: string, fullName: string) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName }),
    });
  }

  async signIn(email: string, password: string) {
    const response = await this.request("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request("/auth/me");
  }

  signOut() {
    localStorage.removeItem("auth_token");
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("auth_token");
  }

  // Blog methods
  async getBlogs() {
    return this.request("/blogs");
  }

  async getBlogBySlug(slug: string) {
    return this.request(`/blogs/slug/${slug}`);
  }

  async getBlogById(id: string) {
    return this.request(`/blogs/${id}`);
  }

  async createBlog(blogData: any) {
    return this.request("/blogs", {
      method: "POST",
      body: JSON.stringify(blogData),
    });
  }

  async updateBlog(id: string, blogData: any) {
    return this.request(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(blogData),
    });
  }

  async deleteBlog(id: string) {
    return this.request(`/blogs/${id}`, {
      method: "DELETE",
    });
  }

  async toggleBlogPublish(id: string, published: boolean) {
    try {
      // First get the specific blog data by ID
      const blog = await this.getBlogById(id);

      if (!blog) {
        throw new Error("Blog not found");
      }

      // Update with all required fields
      return this.request(`/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          slug: blog.slug,
          featured_image_url: blog.featured_image_url || null,
          published,
        }),
      });
    } catch (error) {
      console.error("Error in toggleBlogPublish:", error);
      throw error;
    }
  }

  // Contact submissions
  async submitContact(contactData: any) {
    return this.request("/contact", {
      method: "POST",
      body: JSON.stringify(contactData),
    });
  }

  async getSubmissions() {
    return this.request("/submissions");
  }

  async getUserSubmissions(userId: string) {
    return this.request(`/submissions/user/${userId}`);
  }

  async updateSubmission(id: string, data: any) {
    return this.request(`/submissions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getDashboardStats() {
    return this.request("/submissions/stats/dashboard");
  }

  // Ticket responses
  async getTicketResponses(submissionId: string) {
    return this.request(`/contact/${submissionId}/responses`);
  }

  async addTicketResponse(
    submissionId: string,
    message: string,
    isAdminResponse: boolean
  ) {
    return this.request(`/contact/${submissionId}/responses`, {
      method: "POST",
      body: JSON.stringify({
        message,
        is_admin_response: isAdminResponse,
      }),
    });
  }

  // Profiles
  async getProfiles() {
    return this.request("/profiles");
  }

  async updateUserRole(profileId: string, role: string) {
    return this.request(`/profiles/${profileId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  }

  // Workers
  async getWorkers() {
    return this.request("/workers");
  }

  async getTimeLogs(params?: {
    startDate?: string;
    endDate?: string;
    workerId?: string;
  }) {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.request(`/workers/time-logs${queryString}`);
  }

  async saveTimeLog(data: any) {
    return this.request("/workers/time-logs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTimeLog(id: string, data: any) {
    return this.request(`/workers/time-logs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getDayOffRequests(params?: {
    startDate?: string;
    endDate?: string;
    workerId?: string;
  }) {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.request(`/workers/day-off-requests${queryString}`);
  }

  async createDayOffRequest(data: any) {
    return this.request("/workers/day-off-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDayOffRequest(id: string, data: any) {
    return this.request(`/workers/day-off-requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Services
  async getServices() {
    return this.request("/services");
  }

  async getServiceById(id: string) {
    return this.request(`/services/${id}`);
  }

  async createService(serviceData: any) {
    return this.request("/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id: string, serviceData: any) {
    return this.request(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: "DELETE",
    });
  }

  // Projects
  async getProjects() {
    return this.request("/projects");
  }

  async getProjectById(id: string) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData: any) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: any) {
    return this.request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
