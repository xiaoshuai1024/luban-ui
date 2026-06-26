import { describe, it, expect } from 'vitest';
import { validateAll, initFormState } from '../../src/lib/validation';
import type { PageSchema } from '../../src/lib/schema';

const schema: PageSchema = {
  root: {
    id: 'root',
    type: 'LubanContainer',
    props: {},
    children: [
      {
        id: 'name',
        type: 'LubanInput',
        props: { rules: [{ required: true }] },
      },
      {
        id: 'email',
        type: 'LubanInput',
        props: { rules: [{ type: 'email' }] },
      },
      {
        id: 'agree',
        type: 'LubanSwitch',
        props: { rules: [{ required: true }] },
      },
      { id: 'notes', type: 'LubanInput' }, // 无 rules
    ],
  },
};

describe('initFormState', () => {
  it('initializes string fields to empty string and boolean fields to false', () => {
    const state = initFormState(schema);
    expect(state['name']).toBe('');
    expect(state['email']).toBe('');
    expect(state['agree']).toBe(false);
    expect(state['notes']).toBe('');
  });

  it('uses props.value when present', () => {
    const s: PageSchema = {
      root: {
        id: 'root',
        type: 'LubanContainer',
        props: {},
        children: [
          { id: 'pre', type: 'LubanInput', props: { value: 'hello' } },
        ],
      },
    };
    expect(initFormState(s)['pre']).toBe('hello');
  });
});

describe('validateAll', () => {
  it('returns errors for required-empty and invalid email', () => {
    const state = initFormState(schema); // name='', email='', agree=false
    const errors = validateAll(schema, state);
    expect(errors['name']).toBeTruthy(); // 必填
    expect(errors['agree']).toBeTruthy(); // switch 必填未勾
    // email 为空且非必填 → 跳过类型校验
    expect(errors['email']).toBeUndefined();
  });

  it('returns no errors when all valid', () => {
    const state = { name: '张三', email: 'z@x.com', agree: true, notes: '' };
    expect(validateAll(schema, state)).toEqual({});
  });

  it('reports email type error when non-empty invalid', () => {
    const state = { name: 'x', email: 'not-an-email', agree: true, notes: '' };
    const errors = validateAll(schema, state);
    expect(errors['email']).toBeTruthy();
  });

  it('skips nodes without rules', () => {
    const state = { name: 'x', email: 'z@x.com', agree: true, notes: '' };
    const errors = validateAll(schema, state);
    expect(errors['notes']).toBeUndefined();
  });
});
