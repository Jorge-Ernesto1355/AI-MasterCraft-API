import { IAModel, IAModelDTO } from "../../domain/entities/IAModel";


export class AImodelMapper {
    static toPersistence(model: IAModel): IAModelDTO  {
        return model.toJSON()
    }


    static toDomain(entity: any): IAModel {
        return new IAModel(entity.id, entity.organization, entity.modelName,entity.modelType, entity.config)
    }
}