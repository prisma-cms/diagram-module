

import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class DiagramPortOutProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "DiagramPortOut";

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



class DiagramPortOutModule extends PrismaModule {


  getResolvers() {

    const resolvers = super.getResolvers();


    Object.assign(resolvers.Query, {
      diagramPortOut: this.diagramPortOut,
      diagramPortOuts: this.diagramPortOuts,
      diagramPortOutsConnection: this.diagramPortOutsConnection,
    });


    Object.assign(resolvers.Mutation, {
      // createDiagramPortOutProcessor: this.createDiagramPortOutProcessor.bind(this),
      // updateDiagramPortOutProcessor: this.updateDiagramPortOutProcessor.bind(this),
    });

    // Object.assign(resolvers.Subscription, this.Subscription);


    Object.assign(resolvers, {
      // DiagramPortOutResponse: this.DiagramPortOutResponse(),

      Subscription: {
        diagramPortOut: {
          subscribe: async (parent, args, ctx, info) => {
  
            return ctx.db.subscription.diagramPortOut({}, info);
          },
        },
      },
    });

    return resolvers;
  }


  diagramPortOuts(source, args, ctx, info) {
    return ctx.db.query.diagramPortOuts(args, info);
  }

  diagramPortOut(source, args, ctx, info) {
    return ctx.db.query.diagramPortOut(args, info);
  }

  diagramPortOutsConnection(source, args, ctx, info) {
    return ctx.db.query.diagramPortOutsConnection(args, info);
  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }

  getProcessorClass() {
    return DiagramPortOutProcessor;
  }

  createDiagramPortOutProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).createWithResponse("DiagramPortOut", args, info);
  }

  updateDiagramPortOutProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).updateWithResponse("DiagramPortOut", args, info);
  }

  DiagramPortOutResponse() {

    return {
      data: (source, args, ctx, info) => {

        const {
          id,
        } = source.data || {};

        return id ? ctx.db.query.diagramPortOut({
          where: {
            id,
          },
        }, info) : null;
      }
    }
  }

}


export default DiagramPortOutModule;