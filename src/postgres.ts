import { Client, QueryResult } from 'pg';
import { Injectable } from '@nestjs/common';
import { DB_TABLES } from './tables';

@Injectable()
export class PostgreSQL {
  private db: Client;

  protected async __init() {
    const host = process.env.POSTGRE_HOST;
    const database = process.env.POSTGRE_DB;
    const port = Number(process.env.POSTGRE_PORT);
    const user = process.env.POSTGRE_USER;
    const password = process.env.POSTGRE_PASSWORD;
    const client = new Client({
      host: host,
      database: database,
      port: port,
      user: user,
      password: password,
    });
    await client.connect();
    this.db = client;
  }
  constructor() {
    this.__init();
  }

  getServerInstantce(): Client {
    return this.db;
  }

  setByKeys(obj: any[]) {
    return obj
      .filter((v) => obj[v])
      .map(
        (v) => `${v} = ${typeof obj[v] === 'string' ? `'${obj[v]}'` : obj[v]}`,
      )
      .join(', ');
  }
  async select<T extends Record<string, any>>(props: {
    table: `${DB_TABLES}`;
    condition?: string;
  }): Promise<QueryResult<T>> {
    const { table, condition } = props;
    const _condition = condition ? ` ${condition}` : '';
    return this.db?.query({
      text: `SELECT * FROM ${table}${_condition}`,
    });
  }

  async update<T extends Record<string, string>>(props: {
    table: `${DB_TABLES}`;
    condition?: string;
    text: string;
  }): Promise<QueryResult<T>> {
    const { table, condition, text } = props;
    const _table = `UPDATE ${table}`;
    const _text = text ? ` ${text}` : '';
    const _condition = condition ? ` ${condition}` : '';
    return this.db.query({
      text: `${_table}${_text}${_condition}`,
    });
  }
  /**
   *  @example `INSERT INTO person(name) VALUES($1) WHERE value = 'example'`
   */
  async insert<T extends Record<string, string>>(props: {
    /**
     * @example `INSERT INTO ${table}...`
     * @example `INSERT INTO person...`
     */
    table: `${DB_TABLES}`;

    /**
     *  @use `WHERE value = 'example'`
     *  @example `INSERT INTO ... WHERE value = 'example'`
     * */
    condition?: string;

    /**
     *  @use `(name) VALUES($1)`
     * */
    text: string;
    values: any[];
  }): Promise<QueryResult<T>> {
    const { table, condition, text, values = [] } = props;
    const _table = `INSERT INTO ${table}`;
    const _condition = condition ? ` ${condition}` : '';
    return this.db.query({
      text: `${_table}${text}${_condition}`,
      values: values,
    });
  }
}
