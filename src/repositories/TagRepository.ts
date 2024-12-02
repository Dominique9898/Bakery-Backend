import AppDataSource from '../config/ormconfig';
import { ProductTag } from '../models/ProductTag';

export const TagRepo = AppDataSource.getRepository(ProductTag).extend({
  async findByTagId(tagId: number): Promise<ProductTag | null> {
    return await this.findOne({
      where: { tagId },
      relations: ['options']
    });
  },

  async findByName(name: string): Promise<ProductTag | null> {
    return await this.findOne({
      where: { name }
    });
  },

  async findByProductId(productId: string): Promise<ProductTag[]> {
    return await this.createQueryBuilder('tag')
      .innerJoin('product_tag_relations', 'ptr', 'ptr.tag_id = tag.tag_id')
      .where('ptr.product_id = :productId', { productId })
      .getMany();
  },

  async addProductTag(productId: string, tagId: number) {
    return await this.createQueryBuilder()
      .insert()
      .into('product_tag_relations')
      .values({
        productId,
        tagId
      })
      .execute();
  },

  async removeProductTag(productId: string, tagId: number) {
    return await this.createQueryBuilder()
      .delete()
      .from('product_tag_relations')
      .where('product_id = :productId', { productId })
      .andWhere('tag_id = :tagId', { tagId })
      .execute();
  }
}); 