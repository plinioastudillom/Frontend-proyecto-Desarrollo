export interface Student {
  _id:      string;
  name:     string;
  lastname: string;
  teacher:  Teacher;
  user:     User;
}

export interface Teacher {
  _id: string;
}

export interface User {
  _id:  string;
  name: string;
}
