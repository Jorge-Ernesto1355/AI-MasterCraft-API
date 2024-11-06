import { IAModel, IAModelDTO } from "../../domain/entities/IAModel";


export class AImodelMapper {
    static toPersistence(model: IAModel): IAModelDTO  {
        return model.toJSON()
    }


    static toDomain(entity: any): IAModel {
        
        
        const rawEntity = Array.isArray(entity) ? entity[0] : entity;
        
        const id = rawEntity._id ? rawEntity._id.toString() : rawEntity.id;

        console.log(rawEntity.imageUrl, "rawEntity")
        return new IAModel({
            id,
            modelName: rawEntity.modelName,
            modelType: rawEntity.modelType,
            organization: rawEntity.organization,
            config: rawEntity.configuration || rawEntity.config,
            imageUrl: rawEntity.imageUrl,
                
        });
    }

    
    static toDomainList(entities: any[]): IAModel[] {
        return entities.map(entity => this.toDomain(entity));
    }
}