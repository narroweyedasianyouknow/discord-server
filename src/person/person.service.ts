import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Person } from './person.schema';
import type { PersonType } from './person';
import type { Model } from 'mongoose';

@Injectable()
export class PersonService {
  constructor(@InjectModel(Person.name) private personModel: Model<Person>) {}

  async create(createPersonDto: PersonType) {
    const createdPerson = new this.personModel(createPersonDto);
    return createdPerson.save();
  }

  async findAll(): Promise<PersonType[]> {
    return this.personModel.find().exec();
  }

  async getUser(user: { email?: string; username: string }) {
    const getUser = async (u: Record<string, string>) => {
      const response = await this.personModel.findOne(u).lean().exec();
      if (response) {
        response['id'] = response['_id'];
        delete response['_id'];
        delete response['__v'];
      }
      return response;
    };
    if (user.email) {
      return getUser({ email: user.email });
    } else {
      return getUser({ username: user.username });
    }
  }

  async update(
    props: PersonType & {
      id: string;
    },
  ) {
    const { id, ...person } = props;
    return this.personModel.updateOne(
      {
        id: id,
      },
      person,
    );
  }
}
