class Ac {

   constructor(options) {
      this.init(options);
   }

   init(options) {
      if (!Array.isArray(options)) {
         throw new TypeError('Expected an array as input');
      }

      this.roles = options;

      let map = {};

      for (let index = 0; index < this.roles.length; index++) {
         const option = this.roles[index];

         map[option.role] = {
            can: {}
         };

         if (option.inherits) {
            map[option.role].inherits = option.inherits;
         }

         option.can.forEach(operation => {

            if (typeof operation === 'string') {
               map[option.role].can[operation] = 1;
            } else if (typeof operation.name === 'string'
               && typeof operation.when === 'function') {

                  map[option.role].can[operation.name] = operation.when;
            }
            // Ignore definitions we don't understand
         });

      }

      this.roles = map;
      console.log('ACCESS CONTROL', this.roles);
   }

   print() {
      console.log(this.toString());
   }
}

module.exports = Ac;



let optionsObj = {
   manager: {
      can: ['publish'],
      inherits: ['writer']
   },
   writer: {
      can: ['write', {
         name: 'edit',
         when: function (params) {
            return params.user.id === params.post.owner;
         }
      }],
      inherits: ['guest']
   },
   guest: {
      can: ['read']
   }
};

let options = [{
   role: 'ADMIN',
   can: ['user:create', 'user:read', 'user:update', 'user:delete'],
   inherits: 'CUSTOMER'
}, {
   role: 'CUSTOMER',
   can: ['project:create', 'project:read', 'project:update', 'project:delete'],
   inherits: 'USER'

}, {
   role: 'USER',
   can: ['user:create', 'user:read', 'user:update', 'user:delete'],
}];