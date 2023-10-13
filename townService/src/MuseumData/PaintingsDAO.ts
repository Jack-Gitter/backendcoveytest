import axios, { AxiosResponse } from 'axios';
import PAINTING from './Paintings';

export default class PaintingsDAO {
  public async getPaintings() {
    const res = await axios.get(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects/1',
    );
    PAINTING.push(res.data);
  }

  public printPainting() {
    console.log(PAINTING);
  }
}
