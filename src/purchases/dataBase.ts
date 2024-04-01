import { createConnection, Connection } from "typeorm";

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  index: number;
  @Column({ type: "varchar" })
  id: string;
  @Column({ type: "varchar" })
  projId: string;
  @Column({ type: "varchar" })
  title: string;
  @Column({ type: "varchar" })
  uuid: string;
  @Column({ type: "varchar" })
  approvalTime: string;
  @Column({ type: "varchar" })
  department: string;
  @Column({ type: "varchar" })
  contectPerson: string;
  @Column({ type: "varchar" })
  contectNumber: string;
  @Column({ type: "varchar" })
  checkPerson: string;
  @Column({ type: "varchar" })
  checkNumber: string;
  @Column({ type: "varchar" })
  merchant: string;
  @Column({ type: "varchar" })
  productionName: string;
  @Column({ type: "varchar" })
  brandName: string;
  @Column({ type: "varchar" })
  model: string;
  @Column({ type: "varchar" })
  sellNumber: string;
  @Column({ type: "varchar" })
  unit: string;
  @Column({ type: "text" })
  html: string;
  @Column({ type: "varchar", nullable: true })
  category?: string;
  @Column({ type: "varchar", nullable: true })
  publicTitle?: string;
  @Column({ type: "text", nullable: true })
  proHtml?: string;

  init(obj: any) {
    this.id = obj.id;
    this.projId = obj.projId;
    this.title = obj.title;
    this.uuid = obj.uuid;
    this.approvalTime = obj.approvalTime;
    this.department = obj.department;
    this.contectPerson = obj.contectPerson;
    this.contectNumber = obj.contectNumber;
    this.checkNumber = obj.checkNumber;
    this.checkPerson = obj.checkPerson;
    this.merchant = obj.merchant;
    this.productionName = obj.productionName;
    this.brandName = obj.brandName;
    this.model = obj.model;
    this.sellNumber = obj.sellNumber;
    this.unit = obj.unit;
    this.html = obj.content;
  }
}

export async function initDB() {
  const connection = await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Admin5566",
    database: "purchases",
    entities: [Project],
    synchronize: true,
    // logging: true,
  });
  return connection;
}
