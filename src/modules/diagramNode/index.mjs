

import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class DiagramNodeProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "DiagramNode";

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



class DiagramNodeModule extends PrismaModule {


  getResolvers() {

    const resolvers = super.getResolvers();


    Object.assign(resolvers.Query, {
      diagramNode: this.diagramNode,
      diagramNodes: this.diagramNodes,
      diagramNodesConnection: this.diagramNodesConnection,
    });


    Object.assign(resolvers.Mutation, {
      createDiagramNodeProcessor: this.createDiagramNodeProcessor.bind(this),
      updateDiagramNodeProcessor: this.updateDiagramNodeProcessor.bind(this),
    });

    // Object.assign(resolvers.Subscription, this.Subscription);


    Object.assign(resolvers, {
      DiagramNodeResponse: this.DiagramNodeResponse(),

      Subscription: {
        diagramNode: {
          subscribe: async (parent, args, ctx, info) => {
  
            return ctx.db.subscription.diagramNode({}, info);
          },
        },
      },
    });

    return resolvers;
  }


  diagramNodes(source, args, ctx, info) {
    return ctx.db.query.diagramNodes(args, info);
  }

  diagramNode(source, args, ctx, info) {
    return ctx.db.query.diagramNode(args, info);
  }

  diagramNodesConnection(source, args, ctx, info) {
    return ctx.db.query.diagramNodesConnection(args, info);
  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }

  getProcessorClass() {
    return DiagramNodeProcessor;
  }

  createDiagramNodeProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).createWithResponse("DiagramNode", args, info);
  }

  updateDiagramNodeProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).updateWithResponse("DiagramNode", args, info);
  }

  DiagramNodeResponse() {

    return {
      data: (source, args, ctx, info) => {

        const {
          id,
        } = source.data || {};

        return id ? ctx.db.query.diagramNode({
          where: {
            id,
          },
        }, info) : null;
      }
    }
  }

}


export default DiagramNodeModule;