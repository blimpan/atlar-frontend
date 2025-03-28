export interface Balance {
  amount: {
    currency: string;
    stringValue: string;
    value: number;
  };
  localDate: string;
  reportedType: string;
  type: string;
}

export interface Account {
  entityId: string;
  id: string;
  name: string;
  currency: string;
  identifiers: [{ market: string; number: string; type: string }];
}

export interface Entity {
  id: string;
  legalName: string;
  organizationId: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: {
    currency: string;
    stringValue: string;
    value: number;
  };
  date: string;
  returned: boolean;
  reconciliationStatus: string;
  created: string;
}
