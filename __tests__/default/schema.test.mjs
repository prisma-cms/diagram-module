import chalk from "chalk";

import TestModule from "./module";

import { parse, print } from 'graphql';

import expect from 'expect'

import mocha from 'mocha'
const { describe, it } = mocha


const module = new TestModule();


const requiredTypes = [
  {
    name: "Query",
    fields: {
      both: [
        "testUsers",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "Mutation",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "Diagram",
    fields: {
      both: [
        "id",
        "name",
        "code",
        "createdAt",
        "updatedAt",
        "offsetX",
        "offsetY",
        "zoom",
        "gridSize",
        "CreatedBy",
        "Nodes",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "DiagramNode",
    fields: {
      both: [
        "id",
        "name",
        "color",
        "x",
        "y",
        "Diagram",
        "PortsIn",
        "PortsOut",
        "Building",
        "Checkpoint",
        "Parking",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "DiagramPortIn",
    fields: {
      both: [
        "id",
        "name",
        "Node",
        "Links",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "DiagramPortOut",
    fields: {
      both: [
        "id",
        "name",
        "Node",
        "Links",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "DiagramLink",
    fields: {
      both: [
        "id",
        "width",
        "color",
        "curvyness",
        "PortIn",
        "PortOut",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "Building",
    fields: {
      both: [
        "id",
        "DiagramNode",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "Checkpoint",
    fields: {
      both: [
        "id",
        "DiagramNode",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "Parking",
    fields: {
      both: [
        "id",
        "DiagramNode",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
]


export const verifyTypes = function (types, requiredTypes, verbose = false) {


  if (verbose) {

    types.map(type => {

      const {
        name: nameDef,
        fields,
      } = type;


      const {
        value: name,
      } = nameDef || {}

      console.log(chalk.bgGreen.black("Type name"), name);

      fields && fields.map(field => {

        const {
          name: {
            value: fieldName,
          },
        } = field;

        console.log(chalk.bgWhite.blue("Type filed name"), fieldName);

      });

    });

  }


  requiredTypes.map(type => {


    const {
      name,
      fields: typeFields,
    } = type;


    const {
      both = [],
      prisma = [],
    } = typeFields;

    let requiredFields = [...new Set(both.concat(prisma))]


    if (!requiredFields.length) {
      return;
    }


    it(`Check type "${name}"`, () => {

      const definition = types.find(n => n.name && n.name.value === name);

      expect(typeof definition === "object").toBe(true);

      requiredFields.map(fieldName => {

        let finded = false;


        switch (definition.kind) {

          case "InputObjectTypeDefinition":
          case "ObjectTypeDefinition":

            const {
              fields,
            } = definition;

            finded = fields && fields.findIndex(n => {
              // console.log("n.kind", n.kind);
              return ([
                "FieldDefinition",
                "InputValueDefinition",
              ].indexOf(n.kind) !== -1) && n.name.value === fieldName
            }) !== -1;

            break;

          case "EnumTypeDefinition":

            const {
              values,
            } = definition;


            finded = values && values.findIndex(n => n.name.value === fieldName) !== -1;

            break;

          default:

            console.error("definition", definition);
            throw new Error("Undefined definition kind");
            ;

        }


        if (!finded) {
          throw (`Can not find field ${name}:${fieldName}`);
        }

      })

    })

  });

}



export const verifySchema = function (schema, requiredTypes) {

  const ast = parse(schema);

  const {
    definitions,
  } = ast;


  let types = definitions.filter(n => {

    // console.log(chalk.bgRed("definitions.filter"), n.kind);

    return [
      "ObjectTypeDefinition",
      "InputObjectTypeDefinition",
      "EnumTypeDefinition",
    ].indexOf(n.kind) !== -1;
  });

  verifyTypes(types, requiredTypes);

}


describe('Verify prisma Schema', () => {

  verifySchema(module.getSchema(), requiredTypes);

});


describe('Verify API Schema', () => {

  verifySchema(module.getApiSchema(), requiredTypes);

});

