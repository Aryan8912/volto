import React, { useEffect } from 'react';
import { uniqBy } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, Segment, Table } from 'semantic-ui-react';
import { queryRelations } from '@plone/volto/actions';
import { flattenToAppURL } from '@plone/volto/helpers';
import { UniversalLink } from '@plone/volto/components';

const BrokenRelations = () => {
  const dispatch = useDispatch();
  const brokenRelationStats = useSelector(
    (state) => state.relations?.stats?.broken || {},
  );
  const brokenRelations = useSelector(
    (state) => state.relations?.subrequests?.broken?.relations,
  );

  useEffect(() => {
    dispatch(queryRelations(null, true, 'broken'));
  }, [dispatch]);

  return brokenRelations && Object.keys(brokenRelations).length > 0 ? (
    <>
      <Divider section hidden />
      <Segment>
        <h3>
          <FormattedMessage
            id="Broken relations"
            defaultMessage="Broken relations"
          />
        </h3>
        {Object.keys(brokenRelations).map((relationname) => (
          <div key={relationname}>
            <Divider section hidden />
            <h4>
              <FormattedMessage
                id="countBrokenRelations"
                defaultMessage="{countofrelation} broken {countofrelation, plural, one {relation} other {relations}} of type {typeofrelation}"
                values={{
                  countofrelation: brokenRelationStats[relationname],
                  typeofrelation: relationname,
                }}
              />
            </h4>
            <Table compact="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={6}>
                    <FormattedMessage id="Source" defaultMessage="Source" />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id="Target" defaultMessage="Target" />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {uniqBy(brokenRelations[relationname].items, function (el) {
                  return el.toString();
                }).map((el, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <UniversalLink
                        href={`${flattenToAppURL(el[0])}/edit`}
                        openLinkInNewTab={true}
                      >
                        {flattenToAppURL(el[0])}
                      </UniversalLink>
                    </Table.Cell>
                    <Table.Cell>
                      <UniversalLink
                        href={`${flattenToAppURL(el[1])}/edit`}
                        openLinkInNewTab={true}
                      >
                        {flattenToAppURL(el[1])}
                      </UniversalLink>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ))}
      </Segment>
    </>
  ) : null;
};

export default BrokenRelations;
