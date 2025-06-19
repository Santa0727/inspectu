export interface INote {
  id: string;
  created_at: string;
  data: {
    link: string;
    message: string;
  };
}
