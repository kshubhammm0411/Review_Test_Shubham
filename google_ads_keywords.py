import sys
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
import pandas as pd 
 
# [START generate_keyword_ideas]
def fetch_keywords(
    client, customer_id, location_ids, language_id, keyword_texts, page_url
):
    keyword_plan_idea_service = client.get_service("KeywordPlanIdeaService")
    keyword_competition_level_enum = client.get_type(
        "KeywordPlanCompetitionLevelEnum"
    ).KeywordPlanCompetitionLevel
    keyword_plan_network = client.get_type(
        "KeywordPlanNetworkEnum"
    ).KeywordPlanNetwork.GOOGLE_SEARCH_AND_PARTNERS
    location_rns = _map_locations_ids_to_resource_names(client, location_ids)
    language_rn = client.get_service(
        "GoogleAdsService"
    ).language_constant_path(language_id)
    
    keyword_annotation = client.enums.KeywordPlanKeywordAnnotationEnum
    
    # Either keywords or a page_url are required to generate keyword ideas
    # so this raises an error if neither are provided.
    if not (keyword_texts or page_url):
        raise ValueError(
            "At least one of keywords or page URL is required, "
            "but neither was specified."
        )
    
    
    
    # Only one of the fields "url_seed", "keyword_seed", or
    # "keyword_and_url_seed" can be set on the request, depending on whether
    # keywords, a page_url or both were passed to this function.
    request = client.get_type("GenerateKeywordIdeasRequest")
    request.customer_id = customer_id
    request.language = language_rn
    request.geo_target_constants = location_rns
    request.include_adult_keywords = False
    request.keyword_plan_network = keyword_plan_network
    request.keyword_annotation = keyword_annotation
    
    # To generate keyword ideas with only a page_url and no keywords we need
    # to initialize a UrlSeed object with the page_url as the "url" field.
    if not keyword_texts and page_url:
        request.url_seed.url = page_url
 
    # To generate keyword ideas with only a list of keywords and no page_url
    # we need to initialize a KeywordSeed object and set the "keywords" field
    # to be a list of StringValue objects.
    if keyword_texts and not page_url:
        request.keyword_seed.keywords.extend(keyword_texts)
 
    # To generate keyword ideas using both a list of keywords and a page_url we
    # need to initialize a KeywordAndUrlSeed object, setting both the "url" and
    # "keywords" fields.
    if keyword_texts and page_url:
        request.keyword_and_url_seed.url = page_url
        request.keyword_and_url_seed.keywords.extend(keyword_texts)
 
    keyword_ideas = keyword_plan_idea_service.generate_keyword_ideas(
        request=request
    )
    
    list_keywords = []
    for idea in keyword_ideas:
        competition_value = idea.keyword_idea_metrics.competition.name
        list_keywords.append(idea)
    
    return list_keywords
 
def map_keywords_to_string_values(client, keyword_texts):
    keyword_protos = []
    for keyword in keyword_texts:
        string_val = client.get_type("StringValue")
        string_val.value = keyword
        keyword_protos.append(string_val)
    return keyword_protos
 
 
def _map_locations_ids_to_resource_names(client, location_ids):
    """Converts a list of location IDs to resource names.
    Args:
        client: an initialized GoogleAdsClient instance.
        location_ids: a list of location ID strings.
    Returns:
        a list of resource name strings using the given location IDs.
    """
    build_resource_name = client.get_service(
        "GeoTargetConstantService"
    ).geo_target_constant_path
    return [build_resource_name(location_id) for location_id in location_ids]
 
 
def get_top_keywords(location_ids, search_keywords):
    DEFAULT_LANGUAGE_ID = "1000"
    DEFAULT_LOCATION_IDS = location_ids 
    SEARCH_KEYWORDS = search_keywords
    # ["waxing near me", "facials near me", "skincare near me", "permanent makeup near me"]
    # GoogleAdsClient will read the google-ads.yaml configuration file in the
    # home directory if none is specified.
    googleads_client = GoogleAdsClient.load_from_storage("google-ads.yaml")
  
    try:
        list_keywords = fetch_keywords(
            googleads_client, 
            "7478591435", 
            DEFAULT_LOCATION_IDS, 
            DEFAULT_LANGUAGE_ID, 
            SEARCH_KEYWORDS, 
            None
        )

        list_to_excel = []
        for x in range(len(list_keywords)):
            list_months = []
            list_searches = []
            list_annotations = []
            for y in list_keywords[x].keyword_idea_metrics.monthly_search_volumes:
                list_months.append(str(y.month)[12::] + " - " + str(y.year))
                list_searches.append(y.monthly_searches)
                
            for y in list_keywords[x].keyword_annotations.concepts:
                list_annotations.append(y.concept_group.name)
                
                
            list_to_excel.append([list_keywords[x].text, list_keywords[x].keyword_idea_metrics.avg_monthly_searches, str(list_keywords[x].keyword_idea_metrics.competition)[28::], list_keywords[x].keyword_idea_metrics.competition_index, list_searches, list_months, list_annotations ])
        cols = ["keyword", "avg_search", "competition_level", "competition_index", "searches_past_months", "past_months", "list_annotations"]
        keywords_df = pd.DataFrame(list_to_excel, columns = cols)
        keywords_df.sort_values(by="avg_search", ascending=False, ignore_index=True, inplace=True)
        
        # keywords_df.to_csv(f'keywords_data/{DEFAULT_LOCATION_IDS[0]}_output.csv', header=True, index=False)

        return keywords_df[:5][['keyword', 'avg_search']].to_json(orient='records')

    except GoogleAdsException as ex:
        print(
            f'Request with ID "{ex.request_id}" failed with status '
            f'"{ex.error.code().name}" and includes the following errors:'
        )
        print(f'\tError with message "{ex.message}".')
        if ex.location:
            for field_path_element in ex.location.field_path_elements:
                print(f"\t\tOn field: {field_path_element.field_name}")
        sys.exit(1)
