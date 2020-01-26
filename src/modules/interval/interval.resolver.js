export default {
   Query: {
      intervals: async (parent, args, { models }, info) => {
         console.log('users QUERY', info.fieldNodes);
         return await models.Interval.find({}).sort('position');
      },
      interval: async (parent, { id }, { models }) => {
         return await models.Interval.findById(id);
      }
   },
   Mutation: {
      intervalCreate: async (
         parent,
         { projectId, timetableId, ...rest },
         { models, me },
         info
      ) => {
         console.log('intervalCreate', projectId, timetableId, rest);

         // get postion of last interval in timetable
         // const lastPostion = await models.Interval.findOne({
         //    timetableId: timetableId
         // }).sort('-position');

         // console.log(
         //    'intervalCreate - lastPostion',
         //    lastPostion.position,
         //    lastPostion.position.toString()
         // );
         const timetable = await models.Timetable.findById(timetableId);

         const fieldsDefault = timetable.columns.map(column => {
            if (column.isDefault) {
               const field = {
                  columnId: column.id,
                  type: column.type,
                  [column.type]: column.defaultField[column.type]
               };
               return field;
            }
         });

         console.log('[intervalCreate] - fields', fieldsDefault);

         const interval = await models.Interval.create({
            projectId: projectId,
            timetableId: timetableId,
            userId: me.id,
            fields: fieldsDefault,
            //position: parseInt(lastPostion.position.toString()) + 16384,
            ...rest
         });

         return interval;
      },
      intervalFieldUpdate: async (
         parent,
         { intervalId, intervalFieldId, ...rest },
         { models, me }
      ) => {
         try {
            console.log(
               '[intervalFieldUpdate] - ',
               intervalId,
               intervalFieldId,
               rest
            );
            const key = 'title';
            let update = {};
            Object.keys(rest).forEach(key => {
               update['fields.$.' + key] = rest[key];
            });

            // https://stackoverflow.com/questions/34184197/returning-only-sub-document-based-on-subdocument-id-which-is-the-items-of-array
            const interval = await models.Interval.findOneAndUpdate(
               {
                  _id: intervalId,
                  fields: { $elemMatch: { _id: intervalFieldId } }
               },
               { $set: update },
               { new: true }
            );
            console.log('[intervalFieldUpdate] - ', interval, update);

            const intervalField = interval.fields.find(
               field => field._id == intervalFieldId
            );
            console.log(
               '[intervalFieldUpdate] - ',
               interval,
               update,
               intervalField
            );
            return intervalField;
         } catch (err) {
            console.log('intervalFieldUpdate ERROR', err);
         }
      },
      intervalUpdate: async (parent, { id, ...rest }, { models, me }) => {
         try {
            console.log('intervalUpdate ------- ', id, rest);
            const interval = await models.Interval.findOneAndUpdate(
               { _id: id },
               { ...rest },
               { new: true }
            );

            return interval;
         } catch (err) {
            console.log('intervalUpdate ERROR', err);
         }
      },
      intervalDelete: async (parent, { id }, { models, me }) => {
         return await models.Interval.findByIdAndDelete(id);
      }
   }
};

// const intervalField = await models.Interval.findOneAndUpdate(
//    { _id: intervalId, 'fields._id': intervalFieldId },
//    { $set: { 'fields.$.title': rest.title } },
//    { new: true }
// );
