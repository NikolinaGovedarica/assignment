/**
 * Art data with nested structure.
 * Each node has a name, id, type and an optional list of children.
 */
export interface ArtNode {
    id:string;
    type:string;
    name: string;
    collection?: ArtNode[];
  }