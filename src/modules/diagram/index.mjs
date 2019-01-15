

import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class DiagramProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "Diagram";

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



class DiagramModule extends PrismaModule {


  getResolvers() {

    const resolvers = super.getResolvers();


    Object.assign(resolvers.Query, {
      diagram: this.diagram,
      diagrams: this.diagrams,
      diagramsConnection: this.diagramsConnection,
    });


    Object.assign(resolvers.Mutation, {
      createDiagramProcessor: this.createDiagramProcessor.bind(this),
      updateDiagramProcessor: this.updateDiagramProcessor.bind(this),
    });

    // Object.assign(resolvers.Subscription, this.Subscription);


    Object.assign(resolvers, {
      DiagramResponse: this.DiagramResponse(),

      Subscription: {
        diagram: {
          subscribe: async (parent, args, ctx, info) => {
  
            return ctx.db.subscription.diagram({}, info);
          },
        },
      },
    });

    return resolvers;
  }


  diagrams(source, args, ctx, info) {
    return ctx.db.query.diagrams(args, info);
  }

  diagram(source, args, ctx, info) {
    return ctx.db.query.diagram(args, info);
  }

  diagramsConnection(source, args, ctx, info) {
    return ctx.db.query.diagramsConnection(args, info);
  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }

  getProcessorClass() {
    return DiagramProcessor;
  }

  createDiagramProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).createWithResponse("Diagram", args, info);
  }

  updateDiagramProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).updateWithResponse("Diagram", args, info);
  }

  DiagramResponse() {

    return {
      data: (source, args, ctx, info) => {

        const {
          id,
        } = source.data || {};

        return id ? ctx.db.query.diagram({
          where: {
            id,
          },
        }, info) : null;
      }
    }
  }

}


export default DiagramModule;