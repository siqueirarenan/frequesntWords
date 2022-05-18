import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Base } from '../base.entity';

export class MockBaseRepo<T extends Base> {
  constructor(public mockRepo: T[]) {}
  async findAll(where?: any): Promise<T[]> {
    if (where) {
      Object.keys(where).forEach(
        (key) => where[key] === undefined && delete where[key],
      );
      return this.mockRepo.filter(
        (x) =>
          x.deletedAt == null &&
          Object.keys(where)
            .map((k) => x[k] == where[k])
            .every(Boolean),
      );
    }
    return this.mockRepo.filter((x) => x.deletedAt == null);
  }

  async findPaginated(
    pageLimit: number,
    page: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    orderBy: keyof T = 'id',
    where?: { [Property in keyof T]?: any },
  ): Promise<[T[], number]> {
    if (pageLimit <= 0 || page <= 0)
      throw new BadRequestException(
        'Page limit and page must be greater than 0',
      );
    const all = await this.findAll(where);
    return [all.slice(pageLimit * (page - 1), pageLimit * page), all.length];
  }

  async findOne(where?: any): Promise<T> {
    const findAll = await this.findAll(where);
    if (findAll.length === 0) throw new NotFoundException();
    return findAll[0];
  }

  async findByIds(ids: number[]): Promise<T[]> {
    return this.mockRepo.filter((x) => ids.includes(x.id));
  }

  async findById(id: number): Promise<T> {
    const getElement = this.mockRepo.filter((x) => x.id === id);
    if (getElement.length === 0 || getElement[0].deletedAt != null)
      throw new NotFoundException();
    return getElement[0];
  }

  async insert(entity: T): Promise<T> {
    entity.id = this.mockRepo.length + 1;
    return entity;
  }

  async insertBulk(entities: T[]): Promise<T[]> {
    let i = 0;
    entities = entities.map((entity) => {
      entity.id = this.mockRepo.length + i + 1;
      i++;
      return entity;
    });
    return entities;
  }

  async update(id: number, entity: T): Promise<T> {
    await this.findById(id);
    entity.id = id;
    return entity;
  }

  async delete(id: number | number[]): Promise<any> {
    if (Array.isArray(id)) {
      await this.findByIds(id);
    } else {
      await this.findById(id);
    }
  }

  async countAll(where?: any): Promise<number> {
    return (await this.findAll(where)).length;
  }
}
