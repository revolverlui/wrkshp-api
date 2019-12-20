import mongoose from 'mongoose';

export default {
   Query: {
      timetables: async (parent, args, { models }, info) => {
         console.log('users QUERY', info.fieldNodes);
         return await models.Timetable.find({});
      },
      timetable: async (parent, { id }, { models }) => {
         return await models.Timetable.findById(id);
      }
   },
   Mutation: {
      timetableCreate: async (
         parent,
         { projectId, ...rest },
         { models, me },
         info
      ) => {
         console.log('createTimetable QUERY', info.fieldNodes);
         console.log('createTimetable', projectId, rest);

         // const columnsDefault = [
         //    {
         //       title: 'Duration',
         //       type: 'duration',
         //       width: 100,
         //       position: 1000,
         //       isDefault: true
         //    },
         //    {
         //       title: 'Title',
         //       type: 'title',
         //       width: 200,
         //       position: 2000,
         //       isDefault: true
         //    }
         //    //{ title: 'Description', type: 'text', width: 300, position: 3000 }
         // ];
         console.log(
            'timetableResolver',
            models.Settings.timetables.columns.defaults
         );
         const settingsTimetableColumns = await models.Settings.timetables
            .columns;

         const columnsDefault = settingsTimetableColumns.defaults.map(
            column => {
               return { ...column };
            }
         );

         console.log('columnsDefault', columnsDefault);

         const timetable = await models.Timetable.create({
            projectId: projectId,
            userId: me.id,
            columns: columnsDefault,
            ...rest
         });

         return timetable;
      },
      timetableUpdate: async (parent, { id, ...rest }, { models, me }) => {
         try {
            console.log('updateTimetable ', id, rest);
            const timetable = await models.Timetable.findOneAndUpdate(
               { _id: id },
               {
                  ...rest
               },
               { new: true }
            );

            return timetable;
         } catch (err) {
            console.log('updateTimetable ERROR', err);
         }
      },
      timetableDelete: async (parent, { id }, { models, me }) => {
         return await models.Timetable.findByIdAndDelete(id);
      }
   },
   Timetable: {
      intervals: async (parent, args, { models, me }) => {
         const timetable = await models.Timetable.findById(parent.id);

         const intervals = await models.Interval.find({
            timetableId: parent.id
         }).sort('position');

         const enhancedIntervals = intervals.map(interval => {
            const enhancedFields = timetable.columns.map(column => {
               const field = interval.fields.find(
                  field => field.columnId === column.id
               );

               const enhancedField = {
                  columnId: column.id,
                  width: column.width,
                  type: column.type,
                  ...field
               };

               return enhancedField;
            });

            interval.fields = enhancedFields;
            return interval;
         });

         // 2Do
         // get columns of timetable
         // enhance intervals with columns
         //return intervals;
         return enhancedIntervals;
      }
   }
};
