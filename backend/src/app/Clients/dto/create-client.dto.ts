export class CreateClientDto {
  code_client: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone_1_label: string;
  phone_1: string | null;
  phone_2_label: string;
  phone_2: string | null;
  phone_3_label: string;
  phone_3: string | null;
  rue: string;
  code_postal: number;
  ville: string;
}
