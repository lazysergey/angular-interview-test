/**
 * @param { localMockOnly } - new posts that are uneditable as we need request api for post details, which is not updateable.
 */
export class PostBase {
  title: string;
  body: string;
  userId?: number;
}

export class Post extends PostBase {
  id: number;
}