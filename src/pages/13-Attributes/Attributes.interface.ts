export interface Attribute {
  id: number;
  column_name: string;
  column_label: string;
  data_type: string;
  type: string;
  is_required: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isDelete: boolean;
}

export interface AttributePayload {
  attributeGroupId: number;
  attributeValue: string;
  attributeKey: string;
}

export interface dataType {
  AttributeGroupId: number;
  attributeGroupName: string;
}
