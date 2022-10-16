export interface Student {
  _id:         string;
  name:        string;
  lastname:    string;
  schoolGrade: number;
  img:         string;
  user:        User;
}

export interface User {
  _id:  string;
  name: string;
}
