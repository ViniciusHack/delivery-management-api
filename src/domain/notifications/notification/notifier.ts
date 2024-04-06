export interface SendMailParams {
  email: string;
  content: string;
  subject: string;
}

export abstract class Notifier {
  abstract sendMail(params: SendMailParams): Promise<void>;
}
