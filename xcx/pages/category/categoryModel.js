import { Base } from '../../utils/base.js';
class Category extends Base
{
  constructor()
  {
    super();
  }

  getCategoryData(callback) {
    var param = {
      url: 'category/',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
}


export{Category};
