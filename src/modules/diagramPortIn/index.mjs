

import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class DiagramPortInProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "DiagramPortIn";

    this.private = true;

  }


  async create(method, args, info) {

    let {
      data: {
        ...data
      },
    } = args;


    const CreatedBy = this.getCreatedBy();


    if (!CreatedBy) {
      return;
    }

    const {
      db,
      currentUser,
    } = this.ctx;

    const {
      id: currentUserId,
    } = currentUser;


    Object.assign(data, {
      ...CreatedBy,
    });
    

    Object.assign(args, {
      data,
    });


    return super.create(method, args, info);
  }


  async mutate(method, args, info) {

    // let {
    //   data: { 
    //     ...data
    //   },
    // } = args;


    // Object.assign(data, { 
    // });


    // Object.assign(args, {
    //   data,
    // });

    return super.mutate(method, args);
  }



  getCreatedBy() {

    const {
      currentUser,
    } = this.ctx;

    if (!currentUser) {
      this.addError("Необходимо авторизоваться");
      return;
    }

    const {
      id,
    } = currentUser;

    return {
      CreatedBy: {
        connect: {
          id,
        },
      },
    }
  }

}



class DiagramPortInModule extends PrismaModule {


  getResolvers() {

    const resolvers = super.getResolvers();


    Object.assign(resolvers.Query, {
      diagramPortIn: this.diagramPortIn,
      diagramPortIns: this.diagramPortIns,
      diagramPortInsConnection: this.diagramPortInsConnection,
    });


    Object.assign(resolvers.Mutation, {
      // createDiagramPortInProcessor: this.createDiagramPortInProcessor.bind(this),
      // updateDiagramPortInProcessor: this.updateDiagramPortInProcessor.bind(this),
    });

    // Object.assign(resolvers.Subscription, this.Subscription);


    Object.assign(resolvers, {
      // DiagramPortInResponse: this.DiagramPortInResponse(),

      Subscription: {
        diagramPortIn: {
          subscribe: async (parent, args, ctx, info) => {
  
            return ctx.db.subscription.diagramPortIn({}, info);
          },
        },
      },
    });

    return resolvers;
  }


  diagramPortIns(source, args, ctx, info) {
    return ctx.db.query.diagramPortIns(args, info);
  }

  diagramPortIn(source, args, ctx, info) {
    return ctx.db.query.diagramPortIn(args, info);
  }

  diagramPortInsConnection(source, args, ctx, info) {
    return ctx.db.query.diagramPortInsConnection(args, info);
  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }

  getProcessorClass() {
    return DiagramPortInProcessor;
  }

  createDiagramPortInProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).createWithResponse("DiagramPortIn", args, info);
  }

  updateDiagramPortInProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).updateWithResponse("DiagramPortIn", args, info);
  }

  DiagramPortInResponse() {

    return {
      data: (source, args, ctx, info) => {

        const {
          id,
        } = source.data || {};

        return id ? ctx.db.query.diagramPortIn({
          where: {
            id,
          },
        }, info) : null;
      }
    }
  }

}


export default DiagramPortInModule;