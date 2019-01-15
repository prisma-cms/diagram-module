

import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class DiagramLinkProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "DiagramLink";

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



class DiagramLinkModule extends PrismaModule {


  getResolvers() {

    const resolvers = super.getResolvers();


    Object.assign(resolvers.Query, {
      diagramLink: this.diagramLink,
      diagramLinks: this.diagramLinks,
      diagramLinksConnection: this.diagramLinksConnection,
    });


    Object.assign(resolvers.Mutation, {
      createDiagramLinkProcessor: this.createDiagramLinkProcessor.bind(this),
      updateDiagramLinkProcessor: this.updateDiagramLinkProcessor.bind(this),
    });

    // Object.assign(resolvers.Subscription, this.Subscription);


    Object.assign(resolvers, {
      DiagramLinkResponse: this.DiagramLinkResponse(),

      Subscription: {
        diagramLink: {
          subscribe: async (parent, args, ctx, info) => {
  
            return ctx.db.subscription.diagramLink({}, info);
          },
        },
      },
    });

    return resolvers;
  }


  diagramLinks(source, args, ctx, info) {
    return ctx.db.query.diagramLinks(args, info);
  }

  diagramLink(source, args, ctx, info) {
    return ctx.db.query.diagramLink(args, info);
  }

  diagramLinksConnection(source, args, ctx, info) {
    return ctx.db.query.diagramLinksConnection(args, info);
  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }

  getProcessorClass() {
    return DiagramLinkProcessor;
  }

  createDiagramLinkProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).createWithResponse("DiagramLink", args, info);
  }

  updateDiagramLinkProcessor(source, args, ctx, info) {

    return this.getProcessor(ctx).updateWithResponse("DiagramLink", args, info);
  }

  DiagramLinkResponse() {

    return {
      data: (source, args, ctx, info) => {

        const {
          id,
        } = source.data || {};

        return id ? ctx.db.query.diagramLink({
          where: {
            id,
          },
        }, info) : null;
      }
    }
  }

}


export default DiagramLinkModule;