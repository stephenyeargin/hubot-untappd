/* globals describe, it, beforeEach, afterEach */

const Helper = require('hubot-test-helper');
const chai = require('chai');
const nock = require('nock');

const {
  expect,
} = chai;

const helper = new Helper([
  'adapters/slack.js',
  '../src/untappd-friends.js',
]);

// Alter time as test runs
const originalDateNow = Date.now;
const mockDateNow = () => Date.parse('Tue Mar 30 2018 14:10:00 GMT-0500 (CDT)');

describe('hubot-untappd-friends for slack', () => {
  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error';
    process.env.UNTAPPD_API_KEY = 'foobar1';
    process.env.UNTAPPD_API_SECRET = 'foobar2';
    process.env.UNTAPPD_API_ACCESS_TOKEN = 'foobar3';
    process.env.UNTAPPD_MAX_COUNT = 2;
    Date.now = mockDateNow;
    nock.disableNetConnect();
    this.room = helper.createRoom();
  });

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL;
    delete process.env.UNTAPPD_API_KEY;
    delete process.env.UNTAPPD_API_SECRET;
    delete process.env.UNTAPPD_API_ACCESS_TOKEN;
    delete process.env.UNTAPPD_MAX_COUNT;
    Date.now = originalDateNow;
    nock.cleanAll();
    this.room.destroy();
  });

  // hubot untappd
  it('responds with the latest activity from your friends', (done) => {
    nock('https://api.untappd.com')
      .get('/v4/checkin/recent')
      .query({
        limit: 2,
        access_token: 'foobar3',
      })
      .replyWithFile(200, `${__dirname}/fixtures/checkin-recent.json`);

    const selfRoom = this.room;
    selfRoom.user.say('alice', '@hubot untappd');
    setTimeout(
      () => {
        try {
          expect(selfRoom.messages).to.eql([
            ['alice', '@hubot untappd'],
            [
              'hubot',
              {
                attachments: [
                  {
                    color: '#7CD197',
                    fallback: 'heath (heathseals) was drinking Blonde Ale (Blonde Ale - 5%) by Gara Guzu Brewery at 49 Çukurcuma - an hour ago',
                    footer: '49 Çukurcuma • Earned the Beer Foodie (Level 44) badge and 2 more',
                    footer_icon: 'https://untappd.akamaized.net/badges/bdg_BeerFoodie_sm.jpg',
                    thumb_url: 'https://untappd.akamaized.net/site/beer_logos/beer-764911_07c43_sm.jpeg',
                    title: 'heath (heathseals) was drinking Blonde Ale by Gara Guzu Brewery',
                    title_link: 'https://untappd.com/user/heathseals/checkin/578981788',
                    ts: 1522432073,
                  },
                  {
                    color: '#7CD197',
                    fallback: 'heath (heathseals) was drinking Efes Pilsen (Pilsner - Other - 5%) by Anadolu Efes at DERALIYE OTTOMAN CUISINE - 8 hours ago',
                    footer: 'DERALIYE OTTOMAN CUISINE • Earned the Beer Connoisseur (Level 8) badge',
                    footer_icon: 'https://untappd.akamaized.net/badges/bdg_connoiseur_sm.jpg',
                    thumb_url: 'https://untappd.akamaized.net/site/beer_logos/beer-EfesPilsener_17259.jpeg',
                    title: 'heath (heathseals) was drinking Efes Pilsen by Anadolu Efes',
                    title_link: 'https://untappd.com/user/heathseals/checkin/578869664',
                    ts: 1522406504,
                  },
                ],
                unfurl_links: false,
              },
            ],
          ]);
          done();
        } catch (err) {
          done(err);
        }
      },
      100,
    );
  });

  // hubot untappd badges
  it('responds with the latest badge activity from your friends', (done) => {
    nock('https://api.untappd.com')
      .get('/v4/checkin/recent')
      .query({
        limit: 2,
        access_token: 'foobar3',
      })
      .replyWithFile(200, `${__dirname}/fixtures/checkin-recent.json`);

    const selfRoom = this.room;
    selfRoom.user.say('alice', '@hubot untappd badges');
    setTimeout(
      () => {
        try {
          expect(selfRoom.messages).to.eql([
            ['alice', '@hubot untappd badges'],
            [
              'hubot',
              {
                attachments: [
                  {
                    author_name: 'an hour ago at 49 Çukurcuma',
                    color: '#7CD197',
                    fallback: 'heath (heathseals) earned the Beer Foodie (Level 44) Badge after drinking a Blonde Ale at 49 Çukurcuma - an hour ago',
                    footer: 'Blonde Ale',
                    footer_icon: 'https://untappd.akamaized.net/site/beer_logos/beer-764911_07c43_sm.jpeg',
                    thumb_url: 'https://untappd.akamaized.net/badges/bdg_BeerFoodie_sm.jpg',
                    title: 'heath (heathseals) earned the Beer Foodie (Level 44) Badge',
                    title_link: 'https://untappd.com/user/heathseals/checkin/578981788',
                  },
                  {
                    author_name: 'an hour ago at 49 Çukurcuma',
                    color: '#7CD197',
                    fallback: 'heath (heathseals) earned the 99 Bottles (Level 38) Badge after drinking a Blonde Ale at 49 Çukurcuma - an hour ago',
                    footer: 'Blonde Ale',
                    footer_icon: 'https://untappd.akamaized.net/site/beer_logos/beer-764911_07c43_sm.jpeg',
                    thumb_url: 'https://untappd.akamaized.net/badges/bdg_99Bottles_sm.jpg',
                    title: 'heath (heathseals) earned the 99 Bottles (Level 38) Badge',
                    title_link: 'https://untappd.com/user/heathseals/checkin/578981788',
                  },
                  {
                    author_name: 'an hour ago at 49 Çukurcuma',
                    color: '#7CD197',
                    fallback: 'heath (heathseals) earned the Pizza & Brew (Level 4) Badge after drinking a Blonde Ale at 49 Çukurcuma - an hour ago',
                    footer: 'Blonde Ale',
                    footer_icon: 'https://untappd.akamaized.net/site/beer_logos/beer-764911_07c43_sm.jpeg',
                    thumb_url: 'https://untappd.akamaized.net/badges/bdg_PizzaAndBrew_sm.jpg',
                    title: 'heath (heathseals) earned the Pizza & Brew (Level 4) Badge',
                    title_link: 'https://untappd.com/user/heathseals/checkin/578981788',
                  },
                  {
                    author_name: '8 hours ago at DERALIYE OTTOMAN CUISINE',
                    color: '#7CD197',
                    fallback: 'heath (heathseals) earned the Beer Connoisseur (Level 8) Badge after drinking a Efes Pilsen at DERALIYE OTTOMAN CUISINE - 8 hours ago',
                    footer: 'Efes Pilsen',
                    footer_icon: 'https://untappd.akamaized.net/site/beer_logos/beer-EfesPilsener_17259.jpeg',
                    thumb_url: 'https://untappd.akamaized.net/badges/bdg_connoiseur_sm.jpg',
                    title: 'heath (heathseals) earned the Beer Connoisseur (Level 8) Badge',
                    title_link: 'https://untappd.com/user/heathseals/checkin/578869664',
                  },
                ],
                unfurl_links: false,
              },
            ],
          ]);
          done();
        } catch (err) {
          done(err);
        }
      },
      100,
    );
  });

  // hubot untappd user
  it('responds with the latest beers from a particular user', (done) => {
    nock('https://api.untappd.com')
      .get('/v4/user/info/stephenyeargin')
      .query({
        USERNAME: 'stephenyeargin',
        access_token: 'foobar3',
      })
      .replyWithFile(200, `${__dirname}/fixtures/user-info.json`);
    nock('https://api.untappd.com')
      .get('/v4/user/checkins/stephenyeargin')
      .query({
        limit: 2,
        USERNAME: 'stephenyeargin',
        access_token: 'foobar3',
      })
      .replyWithFile(200, `${__dirname}/fixtures/user-checkins-stephenyeargin.json`);

    const selfRoom = this.room;
    selfRoom.user.say('alice', '@hubot untappd user stephenyeargin');
    setTimeout(
      () => {
        try {
          expect(selfRoom.messages).to.eql([
            ['alice', '@hubot untappd user stephenyeargin'],
            [
              'hubot',
              {
                unfurl_links: false,
                attachments: [
                  {
                    color: '#7CD197',
                    fields: [
                      {
                        short: true,
                        title: 'Joined',
                        value: 'Mar 30, 2018',
                      },
                      {
                        short: true,
                        title: 'Beers',
                        value: 699,
                      },
                      {
                        short: true,
                        title: 'Checkins',
                        value: 1056,
                      },
                      {
                        short: true,
                        title: 'Badges',
                        value: 659,
                      },
                    ],
                    thumb_url: 'https://gravatar.com/avatar/cd8e64b56de7d6c766d895a7b257322d?size=100&d=https%3A%2F%2Fassets.untappd.com%2Fsite%2Fassets%2Fimages%2Fdefault_avatar_v3_gravatar.jpg%3Fv%3D2',
                    title: 'Stephen (stephenyeargin)',
                    title_link: 'https://untappd.com/user/stephenyeargin',
                    fallback: 'Stephen (stephenyeargin): 699 beers, 1056 checkins, 659 badges',
                  },
                  {
                    color: '#7CD197',
                    fallback: 'Spring Seasonal (Belgian Strong Golden Ale - 6%) by Yazoo Brewing Company',
                    footer: 'at Yazoo Brewing Company',
                    footer_icon: 'https://untappd.akamaized.net/venuelogos/venue_8193_b107acce_bg_88.png',
                    thumb_url: 'https://untappd.akamaized.net/site/assets/images/temp/badge-beer-default.png',
                    title: 'Spring Seasonal (Belgian Strong Golden Ale - 6%) by Yazoo Brewing Company',
                    title_link: 'https://untappd.com/user/stephenyeargin/checkin/574773374',
                    ts: 1521412006,
                  },
                  {
                    color: '#7CD197',
                    fallback: 'Hopry (IPA - Imperial / Double - 7.9%) by Yazoo Brewing Company',
                    footer: 'at Yazoo Brewing Company',
                    footer_icon: 'https://untappd.akamaized.net/venuelogos/venue_8193_b107acce_bg_88.png',
                    thumb_url: 'https://untappd.akamaized.net/site/beer_logos/beer-1040813_0a48f_sm.jpeg',
                    title: 'Hopry (IPA - Imperial / Double - 7.9%) by Yazoo Brewing Company',
                    title_link: 'https://untappd.com/user/stephenyeargin/checkin/574768822',
                    ts: 1521411528,
                  },
                ],
              },
            ],
          ]);
          done();
        } catch (err) {
          done(err);
        }
      },
      100,
    );
  });
});
