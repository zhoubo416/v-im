interface Dept {
  id: string;
  name: string;
  avatar: string;
  parentId: string;
  children: Array<Dept>;
}

export default Dept;
