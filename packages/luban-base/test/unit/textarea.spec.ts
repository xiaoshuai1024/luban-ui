import { describe, it, expect } from 'vitest';
import LubanTextArea from '../../src/lib/form/LubanTextArea.vue';
import { withModel } from '../helpers/withModel';

describe('LubanTextArea', () => {
  it('emits update:modelValue on input', async () => {
    const { wrapper, v } = withModel(
      LubanTextArea,
      { label: '多行文本', name: 'field' },
      '',
    );
    await wrapper.get('textarea').setValue('multi');
    expect(v.value).toBe('multi');
  });
});
