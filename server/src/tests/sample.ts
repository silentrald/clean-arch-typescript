import qb from '@modules/query-builder';

// const qr = qb().schema('public')
//   .from('some_table')
//   .select()
//   .limit(5)
//   .offset(5)
//   .toQuery();

// const cqb = qb();
// const qr2 = cqb.schema('public')
//   .from('another_table')
//   .select({
//     name: 'name',
//     age: 'age',
//   })
//   .join('hello', `asdf = ${cqb.value('sample')}`)
//   .where('hi = hi')
//   .where(`hello = ${cqb.value('hello')}`)
//   .limit(5)
//   .toQuery();

// console.log(qr);
// console.log(qr2);

const cqb = qb();
const qr = cqb.schema('sample')
  .from('insert_table')
  .insert([ {
    hi: cqb.value('hi again'),
    hello: cqb.value('asdf'),
  } ])
  .returning('hello, hi')
  .toQuery();

console.log(qr);