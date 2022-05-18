import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Base } from '../base.entity';
import { MockBaseRepo } from './base.repository.mock';

describe('testing Mock base repo', () => {
  let testRepo: TestRepo;
  let relationRepo: RelationTestRepo;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestRepo, RelationTestRepo],
    }).compile();

    testRepo = module.get(TestRepo);
    relationRepo = module.get(RelationTestRepo);
  });

  afterEach(() => {
    testRepo.mockRepo = [];
    relationRepo.mockRepo = [];
  });

  it('should find all entities', async () => {
    testRepo.add(1, 'test1');
    testRepo.add(2, 'test2');

    const result = await testRepo.findAll();

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(TestEntity);
    expect(result[0].id).toEqual(1);
    expect(result[0].name).toEqual('test1');
    expect(result[0].createdAt).not.toBeNull();
    expect(result[0].updatedAt).not.toBeNull();
    expect(result[0].createdAt).toEqual(result[0].updatedAt);
    expect(result[0].deletedAt).toBeNull();
    expect(result[0].optionalProp).toBeNull();
  });

  it('should find no entity if table is empty', async () => {
    const result = await testRepo.findAll();

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);
  });

  it('should find all entities filtering by column value', async () => {
    testRepo.add(1, 'test1', false, false, '1');
    testRepo.add(2, 'test2', false, false, '2');
    testRepo.add(3, 'test3', false, false, '1');

    const result = await testRepo.findAll({ optionalProp: '1' });

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(TestEntity);
    expect(result[0].id).toEqual(1);
    expect(result[1].id).toEqual(3);
    expect(result[0].name).toEqual('test1');
    expect(result[1].name).toEqual('test3');
  });

  it('should find paginated entites', async () => {
    testRepo.add(1, 'test1', false, false, '1');
    testRepo.add(2, 'test2', false, false, '2');
    testRepo.add(3, 'test3', false, false, '1');
    testRepo.add(4, 'test4', false, false, '1');
    testRepo.add(5, 'test5', false, false, '1');

    let page = 1;
    let limit = 10;
    let result = await testRepo.findPaginated(limit, page);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Array);
    expect(result[0].length).toEqual(5);
    expect(result[0][0]).toBeInstanceOf(TestEntity);
    expect(result[0][0].name).toEqual('test1');
    expect(result[1]).toEqual(5);

    page = 1;
    limit = 3;
    result = await testRepo.findPaginated(limit, page);
    expect(result[0].length).toEqual(3);
    expect(result[0][0]).toBeInstanceOf(TestEntity);
    expect(result[0][0].name).toEqual('test1');
    expect(result[1]).toEqual(5);

    page = 2;
    limit = 3;
    result = await testRepo.findPaginated(limit, page);
    expect(result[0].length).toEqual(2);
    expect(result[0][0]).toBeInstanceOf(TestEntity);
    expect(result[0][0].name).toEqual('test4');
    expect(result[1]).toEqual(5);
  });

  it('should throw error if page limit or page are invalid', async () => {
    try {
      await testRepo.findPaginated(0, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(e.message).toContain('Page limit and page must');
    }
  });

  it('should find the first entity filtering by column value', async () => {
    testRepo.add(1, 'test1', false, false, '1');
    testRepo.add(2, 'test2', false, false, '2');
    testRepo.add(3, 'test3', false, false, '2');

    const result = await testRepo.findOne({ optionalProp: '2' });

    expect(result).toBeInstanceOf(TestEntity);
    expect(result.id).toEqual(2);
    expect(result.name).toEqual('test2');
    expect(result.optionalProp).toEqual('2');
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
    expect(result.createdAt).toEqual(result.updatedAt);
    expect(result.deletedAt).toBeNull();
  });

  it('should throw error to find the first entity if column value does not exist', async () => {
    testRepo.add(1, 'test1', false, false, '1');
    testRepo.add(2, 'test2', false, false, '2');

    try {
      await testRepo.findOne({ optionalProp: '3' });
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw error to find the first entity if it is deleted', async () => {
    testRepo.add(1, 'test1', true, false, '1');

    try {
      await testRepo.findOne({ name: 'test1' });
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should find entities by a list of Ids', async () => {
    testRepo.add(1, 'test1', false, false);
    testRepo.add(2, 'test2', false, false);
    testRepo.add(3, 'test3', false, false);

    const result = await testRepo.findByIds([2, 3]);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(TestEntity);
    expect(result[0].id).toEqual(2);
    expect(result[1].id).toEqual(3);
    expect(result[0].name).toEqual('test2');
    expect(result[1].name).toEqual('test3');
  });

  it('should find no entity if list of ids contains invalid ids', async () => {
    testRepo.add(1, 'test1', false, false);
    testRepo.add(2, 'test2', false, false);
    testRepo.add(3, 'test3', false, false);

    const result = await testRepo.findByIds([5, 6]);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);
  });

  it('should find no entity if list of ids is empty', async () => {
    testRepo.add(1, 'test1', false, false);

    const result = await testRepo.findByIds([]);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);
  });

  it('should find one entity by Id', async () => {
    testRepo.add(1, 'test1', false, false);
    relationRepo.add(1, 'relation1', 1);

    const result = await testRepo.findById(1);

    expect(result).toBeInstanceOf(TestEntity);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('test1');
    expect(result.optionalProp).toBeNull();
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
    expect(result.createdAt).toEqual(result.updatedAt);
    expect(result.deletedAt).toBeNull();
  });

  it('should throw error to find by id if it is deleted', async () => {
    testRepo.add(1, 'test1', true, false);

    try {
      await testRepo.findById(1);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should insert a new entity', async () => {
    testRepo.add(1, 'test1', false, false);
    const entity = new RelationTestEntity();
    entity.name = 'relation1';
    entity.testId = 1;

    const result = await relationRepo.insert(entity);

    expect(result).toBeInstanceOf(RelationTestEntity);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('relation1');
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
    expect(result.createdAt).toEqual(result.updatedAt);
    expect(result.testId).toEqual(1);
  });

  it('should insert many new entities and return them without relations', async () => {
    const entity1 = new TestEntity();
    entity1.name = 'test1';
    const entity2 = new TestEntity();
    entity2.name = 'test2';

    const result = await testRepo.insertBulk([entity1, entity2]);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0].name).toEqual('test1');
    expect(result[0].createdAt).not.toBeNull();
    expect(result[0].updatedAt).not.toBeNull();
    expect(result[0].createdAt).toEqual(result[0].updatedAt);
    expect(result[0].relations).toBeUndefined();
  });

  it('should throw an error when update with invalid id', async () => {
    try {
      await testRepo.update(10, new TestEntity());
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw an error if deleting an entity with an invalid id', async () => {
    try {
      await testRepo.delete(1);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should count all entities', async () => {
    testRepo.add(1, 'test1', false, false);
    testRepo.add(2, 'test2', false, false);
    testRepo.add(3, 'test3', false, false);

    const result = await testRepo.countAll();

    expect(result).toEqual(3);
  });

  it('should count all entities with condition', async () => {
    testRepo.add(1, 'test1', false, false);
    testRepo.add(1, 'test2', false, false);
    testRepo.add(1, 'test3', false, false);

    const result = await testRepo.countAll({ name: 'test2' });

    expect(result).toEqual(1);
  });
});

class TestEntity extends Base {
  name: string;
  optionalProp?: string;
  relations: RelationTestEntity[];
}

class RelationTestEntity extends Base {
  name: string;
  test: TestEntity;
  testId: number;
}

class TestRepo extends MockBaseRepo<TestEntity> {
  constructor() {
    super([]);
  }

  add(
    id: number,
    name: string,
    deleted = false,
    updated = false,
    optionalProp: string = null,
  ) {
    const date = new Date();
    const entity = new TestEntity();
    entity.id = id;
    entity.name = name;
    entity.createdAt = date;
    entity.updatedAt = updated ? null : date;
    entity.deletedAt = deleted ? date : null;
    entity.optionalProp = optionalProp;
    entity.relations = [];
    this.mockRepo.push(entity);
  }
}

class RelationTestRepo extends MockBaseRepo<RelationTestEntity> {
  constructor() {
    super([]);
  }

  add(id: number, name: string, testId: number) {
    const date = new Date();
    const test = new TestEntity();
    test.id = testId;
    test.name = name;
    test.createdAt = date;
    test.updatedAt = date;
    test.deletedAt = null;
    test.optionalProp = null;
    test.relations = [];
    const entity = new RelationTestEntity();
    entity.id = id;
    entity.name = name;
    entity.createdAt = date;
    entity.updatedAt = date;
    entity.deletedAt = null;
    entity.test = test;
    entity.testId = testId;
    this.mockRepo.push(entity);
  }
}
