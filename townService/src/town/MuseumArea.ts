import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import InteractableArea from './InteractableArea';
import PaintingsDAO from '../MuseumData/PaintingsDAO';
import {
  TownEmitter,
  BoundingBox,
  Interactable,
  InteractableCommand,
  InteractableCommandReturnType,
  InteractableID,
} from '../types/CoveyTownSocket';
import Player from '../lib/Player';
import InvalidParametersError, { INVALID_COMMAND_MESSAGE } from '../lib/InvalidParametersError';

export default class MuseumArea extends InteractableArea {
  public dao: PaintingsDAO;

  constructor(dao: PaintingsDAO, townEmitter: TownEmitter, id: string, box: BoundingBox) {
    super(id, box, townEmitter);
    this.dao = dao;
  }

  public toModel(): Interactable {
    return {
      id: this.id,
      occupants: this.occupantsByID,
      type: 'MuseumArea',
    };
  }

  public handleCommand<CommandType extends InteractableCommand>(
    command: CommandType,
    player: Player,
  ): InteractableCommandReturnType<CommandType> {
    if (command.type === 'LeaveReview') {
      return undefined as InteractableCommandReturnType<CommandType>;
    }
    throw new InvalidParametersError(INVALID_COMMAND_MESSAGE);
  }

  public static async fromMapObject(
    mapObject: ITiledMapObject,
    broadcastEmitter: TownEmitter,
  ): Promise<MuseumArea> {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed viewing area ${name}`);
    }
    const dao = new PaintingsDAO();
    await dao.getPaintings();
    dao.printPainting();
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new MuseumArea(dao, broadcastEmitter, name as InteractableID, rect);
  }
}
