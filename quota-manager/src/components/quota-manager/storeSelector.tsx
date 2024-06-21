import SelectInput from '@commercetools-uikit/select-input';
import Text from '@commercetools-uikit/text';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useStoresFetcher } from '../../hooks/useStores';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import { PageNotFound } from '@commercetools-frontend/application-components';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';

interface StoreSelectorProps {
  setSelection: (id: string) => void;
  selection: string;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  setSelection,
  selection,
}) => {
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));

  const { stores, error, loading } = useStoresFetcher({
    limit: 100,
    offset: 0,
    locale: dataLocale,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner />
      </Spacings.Stack>
    );
  }
  if (!stores || stores.count < 1) {
    return <PageNotFound />;
  }

  return (
    <Spacings.Stack scale={'l'}>
      <Text.Headline as="h2">Select a Store: </Text.Headline>
      <SelectInput
        value={selection}
        options={stores.results.map((store) => {
          return {
            value: store.id,
            label: formatLocalizedString(
              {
                name: transformLocalizedFieldToLocalizedString(
                  store.nameAllLocales ?? []
                ),
              },
              {
                key: 'name',
                locale: dataLocale,
                fallback: store.key,
                fallbackOrder: projectLanguages,
              }
            ),
          };
        })}
        onChange={(event) => {
          setSelection(event?.target.value as string);
        }}
      ></SelectInput>
    </Spacings.Stack>
  );
};

export default StoreSelector;
