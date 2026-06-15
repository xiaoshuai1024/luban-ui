import { describe, it, expect } from 'vitest';
import LubanSelect from '../../src/lib/form/LubanSelect.vue';
import { withModel } from '../helpers/withModel';

describe('LubanSelect', () => {
  it('emits update:modelValue on change', async () => {
    const { wrapper, v } = withModel(
      LubanSelect,
      {
        label: '选择',
        name: 'field',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
      null as string | null
    );
    await wrapper.get('select').setValue('b');
    expect(v.value).toBe('b');
  });
});
