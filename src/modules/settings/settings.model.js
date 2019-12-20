const settings = {};

settings.timetables = {
   columns: {
      max: 4,
      defaults: [
         {
            title: 'Duration',
            type: 'duration',
            width: 100,
            position: 1000,
            isDefault: true,
            defaultField: {
               duration: 300
            }
         },
         {
            title: 'Title',
            type: 'title',
            width: 200,
            position: 2000,
            isDefault: true,
            defaultField: {
               title: ''
            }
         }
      ]
   }
};

module.exports = settings;
