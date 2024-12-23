import {
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

interface IFindRequestObject {
  query: any;
  relations: string[];
  fields: string[];
  sortQueries: any;
  limitQueries: any;
}

const postfixes = [
  {
    name: 'Bigger Than Or Equal',
    postfix: '_bte',
    operator: MoreThanOrEqual,
  },
  {
    name: 'Bigger Than',
    postfix: '_bt',
    operator: MoreThan,
  },
  {
    name: 'Smaller Than Or Equal',
    postfix: '_ste',
    operator: LessThanOrEqual,
  },
  {
    name: 'Smaller Than',
    postfix: '_st',
    operator: LessThan,
  },
  {
    name: 'Not Equal',
    postfix: '_ne',
    operator: Not,
  },
  {
    name: 'Like',
    postfix: '_lk',
    operator: ILike,
  },
];

const buildWherePostfixQueries = (query, postfix, operator, equal) => {
  let where = {};

  const keys = Object.keys(query).filter((key) =>
    equal
      ? postfixes.reduce(
          (final, { postfix }) => (key.endsWith(postfix) ? false : final),
          true,
        )
      : key.endsWith(postfix),
  );

  if (keys.length) {
    const lists = keys
      ?.filter((key) => typeof query[key] === 'object')
      .reduce(
        (final, current) => ({
          ...final,
          [current.replace(postfix, '')]: equal
            ? In(query[current])
            : operator(In(query[current])),
        }),
        {},
      );

    const nonLists = keys
      ?.filter((key) => typeof query[key] !== 'object')
      .reduce(
        (final, current) => ({
          ...final,
          [current.replace(postfix, '')]: equal
            ? query[current]
            : operator(query[current]),
        }),
        {},
      );

    where = { ...nonLists, ...lists };
  }

  return where;
};

const buildWhereQuery = (query) => {
  let finalWhere = {};

  if (query) {
    postfixes.forEach(({ postfix, operator }) => {
      finalWhere = {
        ...finalWhere,
        ...buildWherePostfixQueries(query, postfix, operator, false),
      };
    });
  }

  finalWhere = {
    ...finalWhere,
    ...buildWherePostfixQueries(query, '', null, true),
  };

  return finalWhere;
};

export const findRequest = ({
  query,
  relations,
  fields = [],
}: Partial<IFindRequestObject>) => {
  const modifiedQuery = buildWhereQuery(query);
  const validQuery = Object.keys(modifiedQuery)
    .filter((q) => fields.includes(q))
    .reduce((newObj, key) => {
      newObj[key] = modifiedQuery[key];
      return newObj;
    }, {});
  return {
    relations,
    where: validQuery,
  };
};
