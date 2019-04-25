export class PostBase {
  title: string;
  body: string;
  userId?: number;
}

export class Post extends PostBase {
  id: number;
}
