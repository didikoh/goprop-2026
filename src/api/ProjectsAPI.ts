const API_BASE_URL = import.meta.env.VITE_API_URL;

// 图片相关接口
export interface ProjectImage {
  id: number;
  filename: string;
  url: string;
  original_filename?: string;
  title?: string;
  description?: string;
  alt_text?: string;
  sort_order: number;
  file_size?: number;
  width?: number;
  height?: number;
  is_primary: boolean;
  created_at?: string;
}

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  uploaded_images?: ProjectImage[];
  errors?: string[];
  batch_id?: number;
  batch_uuid?: string;
}

export interface ProjectImagesResponse {
  success: boolean;
  images: ProjectImage[];
}

// Utility function to format numbers with commas
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '';
  return new Intl.NumberFormat('en-US').format(num);
};

// Utility function to format numbers for input fields (with commas)
export const formatInputNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-US').format(value);
};

// Utility function to parse formatted input back to number
export const parseInputNumber = (value: string): number | null => {
  if (!value || value.trim() === '') return null;
  // Remove commas and any non-digit characters except decimal point
  const cleanValue = value.replace(/[,\s]/g, '');
  // Check if it's a valid number format
  if (!/^\d*\.?\d*$/.test(cleanValue)) return null;
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? null : parsed;
};

// Utility function to format price range
export const formatPriceRange = (min: number | null | undefined, max: number | null | undefined): string => {
  if (!min && !max) return '';
  return `RM${formatNumber(min ?? 0)} - RM${formatNumber(max ?? 0)}`;
};

// Utility function to format room range
export const formatRoomRange = (min: number | null | undefined, max: number | null | undefined): string => {
  if (!min && !max) return '';
  if (min && max && min === max) return `${formatNumber(min)}`;
  if (min && max) return `${formatNumber(min)} - ${formatNumber(max)}`;
  if (min) return `${formatNumber(min)}+`;
  if (max) return `Up to ${formatNumber(max)}`;
  return '';
};

export interface FacilityItem {
  icon: string;
  text: string;
}

export interface Project {
  id: number;
  placeId?: string;
  name?: string;
  status?: string;
  description?: string;
  address?: string;
  website?: string;
  golink?: string;
  price?: string;
  videos?: string;
  panoramas?: string;
  interior?: string;
  developer?: string;
  type?: string;
  tenure?: string;
  units?: string;
  sizeMin?: number | null;
  sizeMax?: number | null;
  year?: string;
  bedroomMin?: number | null;
  bedroomMax?: number | null;
  bathroomMin?: number | null;
  bathroomMax?: number | null;
  carparkMin?: number | null;
  carparkMax?: number | null;
  priceFromMin?: number | null;
  priceFromMax?: number | null;
  rentPriceMin?: number | null;
  rentPriceMax?: number | null;
  developerDesc?: string;
  highlights?: string | FacilityItem[];
  facilities?: string | FacilityItem[];
  views?: number;
  likes?: number;
  coordinates?: string;
  region?: string;
  regionLong?: string;
  chatbot_state?: number;
  location?: string;
  source_table?: string;
  primary_image_url?: string;
}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface ProjectResponse {
  success: boolean;
  data?: Project;
  message?: string;
}

export interface CreateProjectResponse {
  success: boolean;
  id?: number;
  message?: string;
}

export class ProjectsAPI {
  private static async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      // Don't set Content-Type header for FormData requests
      const headers: Record<string, string> = {};
      
      // Only set Content-Type for non-FormData requests
      if (!(options?.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // =================== 新的图片管理方法 ===================

  // 批量上传项目图片
  static async uploadProjectImages(
    projectId: number,
    location: string,
    images: FileList
  ): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('project_id', projectId.toString());
    formData.append('location', location);
    
    // 添加多个图片文件
    for (let i = 0; i < images.length; i++) {
      formData.append('images[]', images[i]);
    }

    return this.request<ImageUploadResponse>(
      `${API_BASE_URL}/goprop/image_manager.php?action=batch_upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
  }

  // 获取项目的所有图片
  static async getProjectImages(projectId: number, location: string): Promise<ProjectImagesResponse> {
    const params = new URLSearchParams({
      action: 'get_project_images',
      project_id: projectId.toString(),
      location: location,
    });

    return this.request<ProjectImagesResponse>(
      `${API_BASE_URL}/goprop/image_manager.php?${params}`
    );
  }

  // 更新图片信息
  static async updateImageInfo(imageData: Partial<ProjectImage> & { id: number }): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `${API_BASE_URL}/goprop/image_manager.php?action=update_image`,
      {
        method: 'POST',
        body: JSON.stringify(imageData),
      }
    );
  }

  // 删除图片
  static async deleteImage(imageId: number): Promise<{ success: boolean; message: string }> {
    const params = new URLSearchParams({
      action: 'delete_image',
      id: imageId.toString(),
    });

    return this.request<{ success: boolean; message: string }>(
      `${API_BASE_URL}/goprop/image_manager.php?${params}`,
      {
        method: 'DELETE',
      }
    );
  }

  // 重新排序图片
  static async reorderImages(imageOrders: Array<{ id: number; sort_order: number }>): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `${API_BASE_URL}/goprop/image_manager.php?action=reorder_images`,
      {
        method: 'POST',
        body: JSON.stringify({ image_orders: imageOrders }),
      }
    );
  }

  // 设置主图
  static async setPrimaryImage(imageId: number, projectId: number, location: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `${API_BASE_URL}/goprop/image_manager.php?action=set_primary`,
      {
        method: 'POST',
        body: JSON.stringify({
          id: imageId,
          project_id: projectId,
          location: location,
        }),
      }
    );
  }

  // =================== 原有的项目管理方法 ===================

  // Get all projects with pagination and search
  static async getAllProjects(
    location: string = 'all',
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<ProjectsResponse> {
    const params = new URLSearchParams({
      action: 'get_all',
      location,
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    return this.request<ProjectsResponse>(
      `${API_BASE_URL}/goprop/manage_projects.php?${params}`
    );
  }

  // Get a single project by ID and location
  static async getProject(id: number, location: string): Promise<ProjectResponse> {
    const params = new URLSearchParams({
      action: 'get',
      id: id.toString(),
      location,
    });

    return this.request<ProjectResponse>(
      `${API_BASE_URL}/goprop/manage_projects.php?${params}`
    );
  }

  // Create a new project (简化版本，不再处理图片上传)
  static async createProject(projectData: Partial<Project>): Promise<CreateProjectResponse> {
    return this.request<CreateProjectResponse>(
      `${API_BASE_URL}/goprop/manage_projects.php?action=create`,
      {
        method: 'POST',
        body: JSON.stringify(projectData),
      }
    );
  }

  // Update an existing project (简化版本，不再处理图片上传)
  static async updateProject(projectData: Partial<Project> & { id: number; location: string }): Promise<ProjectResponse> {
    return this.request<ProjectResponse>(
      `${API_BASE_URL}/goprop/manage_projects.php?action=update`,
      {
        method: 'POST',
        body: JSON.stringify(projectData),
      }
    );
  }

  // Delete a project
  static async deleteProject(id: number, location: string): Promise<ProjectResponse> {
    const params = new URLSearchParams({
      action: 'delete',
      id: id.toString(),
      location,
    });

    return this.request<ProjectResponse>(
      `${API_BASE_URL}/goprop/manage_projects.php?${params}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Get projects from specific location (legacy support)
  static async getProjectsByLocation(location: string): Promise<ProjectsResponse> {
    return this.request<ProjectsResponse>(
      `${API_BASE_URL}/goprop/fetch_projects.php`,
      {
        method: 'POST',
        body: JSON.stringify({ location }),
      }
    );
  }
}

export default ProjectsAPI;
