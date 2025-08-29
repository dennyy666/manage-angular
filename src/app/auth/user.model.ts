export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
  // 其他用户字段...
}

// 登录响应接口
export interface LoginResponse {
  user: User,
  data: User[];
  token: string;
}