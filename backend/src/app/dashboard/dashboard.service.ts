import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getNumberClients() {
    return { number_clients: 100 };
  }

}
